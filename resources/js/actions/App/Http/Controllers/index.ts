import Auth from './Auth'
import StockItemController from './StockItemController'
import Settings from './Settings'

const Controllers = {
    Auth: Object.assign(Auth, Auth),
    StockItemController: Object.assign(StockItemController, StockItemController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers