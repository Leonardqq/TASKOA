import * as TYPES from '../action-types';
import api from '../../api/index';
export default {
	queryAll() {
		return async dispatch => {
			const data = await api.task.getTaskList(0);
			if (parseInt(data.code) === 0) {
				dispatch({
					type: TYPES.TASK_QUERY_ALL,
					payload: data.list
				});
			}
		};
	}
};