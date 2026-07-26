import { getAgendaList } from './src/server/agenda'; async function run() { const res = await getAgendaList(); console.log(JSON.stringify(res, null, 2)); process.exit(0); } run();
