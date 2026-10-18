import { registerRootComponent } from 'expo';

import App from './App';

export { GridRulersScenario } from './GridRulersScenario';
export { GridInteractionsScenario } from './interactions/GridInteractionsScenario';
export { PianoRollMatrixScenario } from './matrix/PianoRollMatrixScenario';
export { SpreadsheetMatrixScenario } from './matrix/SpreadsheetMatrixScenario';
export { SpatialGridScenario } from './spatial/SpatialGridScenario';
export { DawArrangerScenario } from './time/DawArrangerScenario';
export { SchedulerGanttScenario } from './time/SchedulerGanttScenario';

registerRootComponent(App);
