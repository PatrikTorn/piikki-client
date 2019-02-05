export const createActionPointers = (types = []) => {
	let list = {};
	types.map(type => {
		return list[type] = {
			NAME: type,
			PENDING: `${type}_PENDING`,
			FULFILLED: `${type}_FULFILLED`,
			REJECTED: `${type}_REJECTED`,
		}
	});
	return list;
};