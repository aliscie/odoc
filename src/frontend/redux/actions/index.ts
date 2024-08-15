import { UiActions } from '../types/uiTypes';
import { FilesActions } from '../types/filesTypes';
import { ChatActions } from '../types/chatsTypes';

export type AppActions = UiActions | FilesActions | ChatActions;
