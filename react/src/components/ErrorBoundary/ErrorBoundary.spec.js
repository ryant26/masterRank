import React from 'react';
import { shallow, mount } from 'enzyme';

import ErrorBoundary from './ErrorBoundary';

const SomethingsWrong = () => {
  throw Error('Error something went wrong');
}

const mountErrorBoundaryWithError= () => {
    return mount(
        <ErrorBoundary>
            <SomethingsWrong/>
        </ErrorBoundary>
    );
};

const shallowErrorBoundaryWithNoError = () => {
    return shallow(
        <ErrorBoundary/>
    );
};

describe('ErrorBoundary', () => {
    let ErrorBoundaryComponent;

    describe('when no error is thrown', () => {

        beforeEach(() => {
            ErrorBoundaryComponent = shallowErrorBoundaryWithNoError();
        });

        it('should mount', () => {
            expect(ErrorBoundaryComponent).toHaveLength(1);
        });

        it('should set state error to null', () => {
            expect(ErrorBoundaryComponent.state().error).toBe(null);
        });

        it('should set state errorInfo to null', () => {
            expect(ErrorBoundaryComponent.state().errorInfo).toBe(null);
        });

        it('should not render', () => {
            expect(ErrorBoundaryComponent.find('.ErrorBoundary')).toHaveLength(0);
        });
    });

    describe('when error is thrown', () => {
        //TODO: with react 16.2 a solution to suppressing warnings should be available. At that time add it.
        it('should call ComponentDidCatch set state error and errorInfo and then render', () => {
            const spy = jest.spyOn(ErrorBoundary.prototype, 'componentDidCatch');
            ErrorBoundaryComponent = mountErrorBoundaryWithError();
            expect(spy).toHaveBeenCalled();
            expect(ErrorBoundaryComponent.state().error).not.toBe(null);
            expect(ErrorBoundaryComponent.state().errorInfo).not.toBe(null);
            expect(ErrorBoundaryComponent.find('.ErrorBoundary')).toHaveLength(1);
        });
    });
});