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
*
*
* Events can have broader overall types
*   Water change, param. change, settings change, inhabitants change, product addition, cycle change, ailment change
*
* Want to allow for searching of specific event for a specific tank
*   Allow for broad & specific -> Any event, product add, fert., inhabitant, livestock, plant, ailment, ailment uncured, ailment cured
*     All instances, date range, most recent
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
  parameters: Parameter[],
  test_schedule: TestSchedule[],
  recent_water_change: WaterChange,
  ailments: Ailment[],
  recent_product: RecentProduct,
  recent_substrate_fertilizer: RecentProduct,
  recent_water_fertilizer: RecentProduct,
}

export interface TankInhabitant {
  genus: string,
  species: string
}

export interface LightSettings {
  name: string,
  strength: string,
  percentage: number,
  hours_on: number
}

export interface Parameter {
  parameter: string,
  result: number,
  result_unit: string,
  timestamp: string
}

// Schedule for specific test to be taken every n days
export interface TestSchedule {
  parameter: string,
  frequency: number
}

export interface WaterChange {
  percentage: number,
  water_type: string
  timestamp: string,
}

export interface Ailment {
  ailment: string,
  ailment_type: string,
  comments: string
  timestamp: string,
}

export interface RecentProduct {
  product: string,
  dose: number,
  unit: string
  timestamp: string,
}