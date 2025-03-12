/**
 * @format
 */

import { AppRegistry } from 'react-native';
import React from 'react';
import App from './App';
import { name as appName } from './app.json';
import AppContext from './app/Context/AppContext';

class Root extends React.Component {
    state = {
        is_subscribe: global.USER_DATA.is_subscribe,
        playDetail: false,
        current_categories_id: 2
    };

    setPlayDetail = (playDetail) => {
        this.setState({ playDetail });
    };

    setCurrentCategoryId = (catId) => {
        this.setState({ current_categories_id: catId });
    }

    setIsSubscribe = (is_subscribe) => {
        this.setState({ is_subscribe });
    }

    render() {

        return (
            <AppContext.Provider value={{
                playDetail: this.state.playDetail,
                setPlayDetail: this.setPlayDetail,
                setCurrentCategoryId: this.setCurrentCategoryId,
                current_categories_id:this.state.current_categories_id,
                is_subscribe: this.state.is_subscribe,
                setIsSubscribe: this.setIsSubscribe
            }}>
                <App />
                
            </AppContext.Provider>
        );
    }
}

AppRegistry.registerComponent(appName, () => Root);
