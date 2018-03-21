import React from 'react';
import { shallow } from 'enzyme';
import LoginFailedCard from 'components/Login/LoginFailedCard/LoginFailedCard';


const renderComponentWithQueryString = (queryString) => {
    Object.defineProperty(window.location, 'search', {
        writable: true,
        value: queryString
    });

    return shallow(
        <LoginFailedCard/>
    );
};

describe('LoginFailedCard', () => {
    const namespaceClass = '.LoginFailedCard';
    const errorTitleClass = '.error-title';

    describe('When window.location does not contain query params', () => {
        let component;

        beforeEach(() => {
            component = renderComponentWithQueryString('');
        });

        it('should not show the card', () => {
            expect(component.find(namespaceClass)).toHaveLength(0);
        });
    });

    describe('When window.location contains the failedLogin query param but not platformDisplayName query param', () => {
        let component;

        beforeEach(() => {
            component = renderComponentWithQueryString('?failedLogin=true');
        });

        it('should show the card', () => {
            expect(component.find(namespaceClass)).toHaveLength(1);
        });

        it('should use the error title not containing a platform display name', () => {
            expect(component.find(errorTitleClass).first().text()).toBe('Unable to retrieve your account.');
        });
    });

    describe('When window.location contains the failedLogin and platformDisplayName query params', () => {
        const displayName = 'test%231234';
        let component;

        beforeEach(() => {
            component = renderComponentWithQueryString(`?failedLogin=true&platformDisplayName=${displayName}`);
        });

        it('should show the card', () => {
            expect(component.find(namespaceClass)).toHaveLength(1);
        });

        it('should use the error title containing a platform display name', () => {
            expect(component.find(errorTitleClass).first().text()).toBe(`Unable to retrieve the account test#1234.`);
        });

        it('should use the error title not containing a platform display name when the query param is empty', () => {
            component = renderComponentWithQueryString(`?failedLogin=true&platformDisplayName=`);
            expect(component.find(errorTitleClass).first().text()).toBe('Unable to retrieve your account.');
        });
    });
});