import { Dispatch } from 'redux';
import { handleRedux } from '../redux/store/handleRedux';

/**
 * Logs out the user from MetaMask (MSQ) if they are connected
 * @param dispatch - Redux dispatch function
 * @param isLoggedIn - Current login state
 * @returns Promise<void>
 */
const logoutMetaMask = async (dispatch: Dispatch, isLoggedIn: boolean): Promise<void> => {
  // First check if the user is logged in at all
  if (!isLoggedIn) {
    return;
  }

  // Then check if MSQ is available and connected
  if (window.ic?.msq) {
    try {
      const isConnected = await window.ic.msq.isConnected();
      
      if (isConnected) {
        // Disconnect from MSQ
        await window.ic.msq.disconnect();
        
        // Update the Redux state
        dispatch(handleRedux("LOGOUT"));
        
        console.log('Successfully logged out from MetaMask (MSQ)');
      }
    } catch (error) {
      console.error('Error during MetaMask logout:', error);
    }
  }
};

export default logoutMetaMask;