import { CanActivateFn } from '@angular/router';
import api from 'src/api/api';



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