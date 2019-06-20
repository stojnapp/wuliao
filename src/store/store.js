
/*根状态管理*/
import state from './state';
import getter from './getter';
import mustation from './mutations';
import action from './actions';

export default new Vuex.Store({
  state,
  getters:getter,
  mutations:mustation,
  actions:action
})
