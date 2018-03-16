import SafariView from 'react-native-safari-view';

export const handleExternalUrl = url =>  
    SafariView.isAvailable().then(SafariView.show({ url }));