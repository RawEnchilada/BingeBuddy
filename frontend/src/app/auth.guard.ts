import { CanActivateFn } from '@angular/router';
import api from 'src/api/api';


/**
 * Allow access to the content pages only if the user is authorized.
 */
export function contentGuard(): CanActivateFn {
    return () => {
        if (api.isAuthorized) {
            return true;
        } else {
            console.warn('Not authorized, login again.');
            //window.location.href = '/'; doesn't work reliably, also might be confusing for the user.
            return false;
        }
    }
}
/**
 * Allow access to the login page only if the user is not already authorized.
 */
export function loginGuard(): CanActivateFn {
    return () => {
        if (!api.isAuthorized) {
            return true;
        } else {
            console.log('Already authorized, redirecting to browse.');
            window.location.href = '/browse';
            return false;
        }
    }
}