import { CanActivateFn } from '@angular/router';
import api from 'src/api/api';



export function contentGuard(): CanActivateFn {
    return () => {
        if (api.isAuthorized) {
            return true;
        } else {
            console.warn('Not authorized, redirecting to login.');
            window.location.href = '/';
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