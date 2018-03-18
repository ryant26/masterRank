import React from 'react';
import { shallow } from 'enzyme';

import Dashboard from 'pages/Dashboard/Dashboard';
import Sidebar from 'components/Sidebar/Sidebar';
import ContentArea from 'components/ContentArea/ContentArea';
import GroupInfoModal from 'components/Modal/GroupInfoModal';
import Module from 'model/model';

jest.mock('api/websocket', () => {
    return jest.fn();
});
jest.mock('model/store', () => {
    return jest.fn();
});

function setupMocks() {
    window.localStorage = jest.fn();
    Module.initialize = jest.fn();
}

const getDashboardComponent = () => {
    return shallow(
        <Dashboard />
    );
};

describe('Dashboard', () => {
    let DashboardComponent;

    beforeEach(() => {
        setupMocks();
        DashboardComponent = getDashboardComponent();
    });

    it('should render when component loads', () => {
        expect(DashboardComponent).toHaveLength(1);
    });

    it('should render Sidebar when component loads', () => {
        expect(DashboardComponent.find(Sidebar)).toHaveLength(1);
    });

    it('should render ContentArea when component loads', () => {
        expect(DashboardComponent.find(ContentArea)).toHaveLength(1);
    });

    it('should render GroupInfoModal when component loads', () => {
        expect(DashboardComponent.find(GroupInfoModal)).toHaveLength(1);
    });
});