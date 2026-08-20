import { UnauthorizedException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

function context(): ExecutionContext {
  return {
    getHandler: () => function handler() {},
    getClass: () => class Controller {},
  } as unknown as ExecutionContext;
}

function guardWithPublic(isPublic: boolean | undefined) {
  const reflector = new Reflector();
  jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(isPublic);
  return new JwtAuthGuard(reflector);
}

describe('JwtAuthGuard', () => {
  describe('@Public() handling', () => {
    it('short-circuits a public route without consulting passport', () => {
      const guard = guardWithPublic(true);
      const passport = jest
        .spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate')
        .mockReturnValue(true);

      expect(guard.canActivate(context())).toBe(true);
      expect(passport).not.toHaveBeenCalled();
    });

    it('delegates to passport when the route is not public', () => {
      const guard = guardWithPublic(undefined);
      const passport = jest
        .spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate')
        .mockReturnValue(true);

      guard.canActivate(context());
      expect(passport).toHaveBeenCalled();
    });
  });

  // The global guard is what makes every unmarked route authenticated. If
  // handleRequest ever returned a falsy user instead of throwing, those routes
  // would silently run with no user attached.
  describe('handleRequest', () => {
    it('returns the user when one was resolved', () => {
      const guard = guardWithPublic(undefined);
      const user = { sub: 'u1', email: 'a@b.c', role: 'CITIZEN' };
      expect(guard.handleRequest(null, user)).toBe(user);
    });

    it('throws when no user was resolved', () => {
      const guard = guardWithPublic(undefined);
      expect(() => guard.handleRequest(null, undefined)).toThrow(UnauthorizedException);
    });

    it('rethrows the original error in preference to a generic 401', () => {
      const guard = guardWithPublic(undefined);
      const original = new Error('token expired');
      expect(() => guard.handleRequest(original, undefined)).toThrow(original);
    });
  });
});
