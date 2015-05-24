import {Actions} from 'flummox';

class EditorActions extends Actions {
  toggleNote(offset, column) {
    return {offset, column};
  }

  changeBPM(bpm) {
    return bpm;
  }

  loadData(data) {
    return data;
  }
}

export default EditorActions;
