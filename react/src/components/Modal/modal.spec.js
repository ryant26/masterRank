import React from 'react';
import { mount } from 'enzyme';
import Modal from './Modal';

describe('Modal Component', () => {
    let wrapper;
    
    beforeEach(() => {
        wrapper = mount(
            <Modal modalOpen={true} closeModal={() => {}}>
                <div/>
            </Modal>
        );
    });
    
    it('should render without exploding', () => {
        expect(wrapper.find(Modal)).toBeTruthy();
    });
    
    it('should render its children within', () => {
        wrapper = mount(
            <Modal modalOpen={true} closeModal={() => {}}>
                <div id="myID"/>
            </Modal>
        );

        expect(wrapper.find('#myID').length).toEqual(1);
    });

    it('should call the close function upon clicking the close button', (done) => {
        wrapper = mount(
            <Modal modalOpen={true} closeModal={done}>
                <div/>
            </Modal>
        );

        wrapper.find('.close-button').simulate('click');
    });
});