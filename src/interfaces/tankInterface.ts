import { LightSettings } from "./lightInterface"
import { Parameter } from "./parameterInterface"
import { TestSchedule } from "./testScheduleInterface"
import { WaterChange } from "./waterChange"
import { Ailment } from "./ailmentInterface"

export interface TankInhabitant_Item {
  genus: string,
  species: string
}

export interface TankInhabitant {
  [parameter: string]: TankInhabitant_Item
}

/* TODO
* Needs full range of items to trigger all event types
* WATER_CHANGE
* LIGHT_SETTINGS_CHANGED
* PARAMETER_TESTED
* LIVESTOCK_X
* PLANT_X
*   ^ Create event when any of these differ from previous state
*     ^ Deaths need some way for user to define that a death occurred which resulted in the removal

* WATER_COLUMN_FERTILIZED
* SUBSTRATE_FERTILIZED
* ALGICIDE_ADDED
* MEDICATION_ADDED
*   ^ Create event when product added, check product type on addition of product
*     ^ Then check all plants & livestock within tank for sensitivities to product being added, warn if found

* CYCLE_STARTED
* CYCLE_COMPLETE
* CYCLE_CRASHED
*   ^ Create event when isCycled differs from previous state

* AILMENT_DX
* AILMENT_CURED
*   ^ Create event when ailment differs from previous state
*     Needs Ailment interface ( name & type ) & enum ( enum to contain ailment types -> viral, bacterial, fungal, parasitic )
*     Needs Ailment added to Tank interface as well
*/

export interface Tank {
  id: string,
  volume: number,
  volume_unit: string,
  is_cycled: boolean,
  filtration: string,
  substrate: string,
  temperature_setting: number,
  temperature_unit: string,
  livestock: TankInhabitant[],
  plants: TankInhabitant[],
  light_settings: LightSettings,
  parameters: Parameter,
  test_schedule: TestSchedule,
  recent_water_change: WaterChange,
  ailment: Ailment[]
}