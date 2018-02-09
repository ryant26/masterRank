import React from 'react';
import { shallow } from 'enzyme';

import ErrorPage from './ErrorPage';

const getErrorPageComponent = (errorMessage) => {
    return shallow(
        <ErrorPage errorMessage={errorMessage}/>
    );
};

describe('ErrorPage', () => {
    let ErrorPageComponent;
    let mockErrorMessage = 'MOCK_ERROR_MESSAGE';

    beforeEach(() => {
        ErrorPageComponent = getErrorPageComponent(mockErrorMessage);
    });

    it('should render when component loads', () => {
        expect(ErrorPageComponent).toHaveLength(1);
    });

    it('should have className ErrorPage when component loads', () => {
        expect(ErrorPageComponent.find('.ErrorPage')).toHaveLength(1);
    });

    it('should render the error message past in props when component loads', () => {
        expect(ErrorPageComponent.find('.ErrorPage').text()).toBe(mockErrorMessage);
    });
});