import React from 'react';
import { mount } from 'enzyme';
import GroupModal from './GroupInfoModal';
import Modal from './Modal';
import {createStore} from "../../model/store";
import {updateUser} from "../../actionCreators/user";
import {updateGroup} from "../../actionCreators/group";
import groups from '../../resources/groupInvites';
import {users} from '../../resources/users';

let getStore = () => {
    let store = createStore();
    store.dispatch(updateGroup(groups[0]));
    store.dispatch(updateUser(users[0]));
    return store;
};

describe('Modal Component', () => {
    let wrapper;
    
    beforeEach(() => {
        wrapper = mount(
            <GroupModal store={getStore()}/>
        );
    });
    
    it('should render without exploding', () => {
        expect(wrapper.find(Modal)).toBeTruthy();
    });
});