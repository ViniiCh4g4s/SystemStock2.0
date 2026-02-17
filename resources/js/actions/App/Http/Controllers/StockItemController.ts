import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\StockItemController::index
* @see app/Http/Controllers/StockItemController.php:50
* @route '/'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StockItemController::index
* @see app/Http/Controllers/StockItemController.php:50
* @route '/'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockItemController::index
* @see app/Http/Controllers/StockItemController.php:50
* @route '/'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StockItemController::index
* @see app/Http/Controllers/StockItemController.php:50
* @route '/'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\StockItemController::index
* @see app/Http/Controllers/StockItemController.php:50
* @route '/'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StockItemController::index
* @see app/Http/Controllers/StockItemController.php:50
* @route '/'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StockItemController::index
* @see app/Http/Controllers/StockItemController.php:50
* @route '/'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\StockItemController::store
* @see app/Http/Controllers/StockItemController.php:74
* @route '/stock'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/stock',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StockItemController::store
* @see app/Http/Controllers/StockItemController.php:74
* @route '/stock'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockItemController::store
* @see app/Http/Controllers/StockItemController.php:74
* @route '/stock'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StockItemController::store
* @see app/Http/Controllers/StockItemController.php:74
* @route '/stock'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StockItemController::store
* @see app/Http/Controllers/StockItemController.php:74
* @route '/stock'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\StockItemController::update
* @see app/Http/Controllers/StockItemController.php:109
* @route '/stock/{stockItem}'
*/
export const update = (args: { stockItem: number | { id: number } } | [stockItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/stock/{stockItem}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StockItemController::update
* @see app/Http/Controllers/StockItemController.php:109
* @route '/stock/{stockItem}'
*/
update.url = (args: { stockItem: number | { id: number } } | [stockItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stockItem: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { stockItem: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            stockItem: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        stockItem: typeof args.stockItem === 'object'
        ? args.stockItem.id
        : args.stockItem,
    }

    return update.definition.url
            .replace('{stockItem}', parsedArgs.stockItem.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockItemController::update
* @see app/Http/Controllers/StockItemController.php:109
* @route '/stock/{stockItem}'
*/
update.post = (args: { stockItem: number | { id: number } } | [stockItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StockItemController::update
* @see app/Http/Controllers/StockItemController.php:109
* @route '/stock/{stockItem}'
*/
const updateForm = (args: { stockItem: number | { id: number } } | [stockItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StockItemController::update
* @see app/Http/Controllers/StockItemController.php:109
* @route '/stock/{stockItem}'
*/
updateForm.post = (args: { stockItem: number | { id: number } } | [stockItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, options),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\StockItemController::updateQty
* @see app/Http/Controllers/StockItemController.php:157
* @route '/stock/{stockItem}/qty'
*/
export const updateQty = (args: { stockItem: number | { id: number } } | [stockItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateQty.url(args, options),
    method: 'patch',
})

updateQty.definition = {
    methods: ["patch"],
    url: '/stock/{stockItem}/qty',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\StockItemController::updateQty
* @see app/Http/Controllers/StockItemController.php:157
* @route '/stock/{stockItem}/qty'
*/
updateQty.url = (args: { stockItem: number | { id: number } } | [stockItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stockItem: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { stockItem: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            stockItem: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        stockItem: typeof args.stockItem === 'object'
        ? args.stockItem.id
        : args.stockItem,
    }

    return updateQty.definition.url
            .replace('{stockItem}', parsedArgs.stockItem.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockItemController::updateQty
* @see app/Http/Controllers/StockItemController.php:157
* @route '/stock/{stockItem}/qty'
*/
updateQty.patch = (args: { stockItem: number | { id: number } } | [stockItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateQty.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\StockItemController::updateQty
* @see app/Http/Controllers/StockItemController.php:157
* @route '/stock/{stockItem}/qty'
*/
const updateQtyForm = (args: { stockItem: number | { id: number } } | [stockItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateQty.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StockItemController::updateQty
* @see app/Http/Controllers/StockItemController.php:157
* @route '/stock/{stockItem}/qty'
*/
updateQtyForm.patch = (args: { stockItem: number | { id: number } } | [stockItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateQty.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateQty.form = updateQtyForm

/**
* @see \App\Http\Controllers\StockItemController::destroy
* @see app/Http/Controllers/StockItemController.php:171
* @route '/stock/{stockItem}'
*/
export const destroy = (args: { stockItem: number | { id: number } } | [stockItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/stock/{stockItem}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\StockItemController::destroy
* @see app/Http/Controllers/StockItemController.php:171
* @route '/stock/{stockItem}'
*/
destroy.url = (args: { stockItem: number | { id: number } } | [stockItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stockItem: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { stockItem: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            stockItem: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        stockItem: typeof args.stockItem === 'object'
        ? args.stockItem.id
        : args.stockItem,
    }

    return destroy.definition.url
            .replace('{stockItem}', parsedArgs.stockItem.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockItemController::destroy
* @see app/Http/Controllers/StockItemController.php:171
* @route '/stock/{stockItem}'
*/
destroy.delete = (args: { stockItem: number | { id: number } } | [stockItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\StockItemController::destroy
* @see app/Http/Controllers/StockItemController.php:171
* @route '/stock/{stockItem}'
*/
const destroyForm = (args: { stockItem: number | { id: number } } | [stockItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StockItemController::destroy
* @see app/Http/Controllers/StockItemController.php:171
* @route '/stock/{stockItem}'
*/
destroyForm.delete = (args: { stockItem: number | { id: number } } | [stockItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const StockItemController = { index, store, update, updateQty, destroy }

export default StockItemController