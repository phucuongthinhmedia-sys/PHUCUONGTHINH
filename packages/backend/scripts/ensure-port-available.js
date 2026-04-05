const { execFileSync } = require('child_process');

const port = Number.parseInt(process.env.PORT || '3001', 10);

function run(command, args) {
  try {
    return execFileSync(command, args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch (error) {
    if (error.status === 1) {
      return '';
    }

    if (error.code === 'ENOENT') {
      return '';
    }

    throw error;
  }
}

function toPidList(output) {
  return [...new Set(
    output
      .split(/\r?\n/)
      .map((value) => Number.parseInt(value.trim(), 10))
      .filter((value) => Number.isInteger(value) && value > 0),
  )];
}

function getListeningPids(targetPort) {
  if (!Number.isInteger(targetPort) || targetPort <= 0) {
    return [];
  }

  if (process.platform === 'win32') {
    return toPidList(
      run('powershell', [
        '-NoProfile',
        '-Command',
        `$connections = Get-NetTCPConnection -LocalPort ${targetPort} -State Listen -ErrorAction SilentlyContinue; if ($connections) { $connections | Select-Object -ExpandProperty OwningProcess }`,
      ]),
    );
  }

  return toPidList(run('lsof', ['-ti', `tcp:${targetPort}`, '-sTCP:LISTEN']));
}

function getProcessName(pid) {
  if (process.platform === 'win32') {
    return run('powershell', [
      '-NoProfile',
      '-Command',
      `(Get-Process -Id ${pid} -ErrorAction SilentlyContinue).ProcessName`,
    ])
      .trim()
      .toLowerCase();
  }

  return run('ps', ['-p', String(pid), '-o', 'comm='])
    .trim()
    .toLowerCase();
}

function isProcessRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function stopProcess(pid) {
  try {
    process.kill(pid, 'SIGTERM');
  } catch {}

  for (let attempt = 0; attempt < 10; attempt += 1) {
    if (!isProcessRunning(pid)) {
      return true;
    }

    await sleep(300);
  }

  try {
    process.kill(pid, 'SIGKILL');
  } catch {}

  for (let attempt = 0; attempt < 10; attempt += 1) {
    if (!isProcessRunning(pid)) {
      return true;
    }

    await sleep(300);
  }

  return !isProcessRunning(pid);
}

async function main() {
  const listeningPids = getListeningPids(port).filter((pid) => pid !== process.pid);

  if (listeningPids.length === 0) {
    return;
  }

  const nodePids = [];
  const blockedPids = [];

  for (const pid of listeningPids) {
    const processName = getProcessName(pid);

    if (processName.includes('node')) {
      nodePids.push(pid);
      continue;
    }

    blockedPids.push({
      pid,
      processName: processName || 'unknown',
    });
  }

  if (blockedPids.length > 0) {
    const owners = blockedPids
      .map(({ pid, processName }) => `${processName} (${pid})`)
      .join(', ');

    throw new Error(
      `Port ${port} đang bị chiếm bởi tiến trình không phải Node.js: ${owners}`,
    );
  }

  for (const pid of nodePids) {
    console.log(`Đang giải phóng cổng ${port} từ tiến trình Node ${pid}...`);
    const stopped = await stopProcess(pid);

    if (!stopped) {
      throw new Error(`Không thể dừng tiến trình Node ${pid} trên cổng ${port}`);
    }
  }

  const remainingPids = getListeningPids(port).filter((pid) => pid !== process.pid);

  if (remainingPids.length > 0) {
    throw new Error(
      `Cổng ${port} vẫn đang bị chiếm dụng sau khi dọn dẹp: ${remainingPids.join(', ')}`,
    );
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
