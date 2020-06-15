'use strict'

export function JsonStorage(storage = localStorage) {
	this.put = function(key, value) {
		storage.setItem(key, JSON.stringify(value))
		return this
	}

	this.set = function(key, ...objs) {
		let v = this.get(key) || {}
		Object.assign(v, ...objs)
		this.put(key, v)
		// console.log('## set storage properties: %s:%o', key, v)
		return this
	}

	this.get = function(key, defVal) {
		let v = storage.getItem(key)
		if (v == null && defVal != null) {
			v = defVal
			this.put(key, defVal)
			return v
		}
		return typeof v === 'string' ? JSON.parse(v) : v
	}

	this.putPlain = this.setPlain = function(key, val) {
		storage.setItem(key, val)
		return this;
	}

	this.getPlain = function(key) {
		return storage.getItem(key)
	}

	this.remove = function(...keys) {
		keys.forEach(key => storage.removeItem(key))
		return this
	}

	this.pop = function(key) {
		let val = this.get(key)
		// console.log('## pop storage value: %s:%o', key, val)
		storage.removeItem(key)
		return val
	}
}

// 窨井盖数据采集APP
const S_APP_STORE = 'lampblack-data-show'
export const $s = new JsonStorage()
export const requireContext = () => {
  let context = $s.get(S_APP_STORE)
  if (context == null) {
    context = {
      login: {}
    }
    $s.set(S_APP_STORE, context)
  }
  return context
}
export const getContext = () => $s.get(S_APP_STORE) || {
	login: {}
};
export const saveContext = (context = context) => $s.set(S_APP_STORE, context);
export const updateContext = ({prop, value}) => {
  let c = requireContext()
  c[prop] = value
  $s.set(S_APP_STORE, c)
}

window.$c = window.context = requireContext()
