import React from 'react';
import { shallow } from 'enzyme';

import Error from './Error';

const shallowError = (error) => {
    return shallow(
        <Error error={error}/>
    );
};

describe('Error', () => {
    let ErrorComponent;
    const error = 'Error adding hero "tracer", please try again or refresh page';

    beforeEach(() => {
        ErrorComponent = shallowError(error);
    });

    it('should render', () => {
        expect(ErrorComponent).toHaveLength(1);
    });

    it('should set title text to "Something went wrong!"', () => {
        expect(ErrorComponent.find('.title').text())
            .toBe(`Something went wrong!`);
    });

    it('should set title message to props message', () => {
        expect(ErrorComponent.find('.message').text())
            .toBe(error);
    });
});