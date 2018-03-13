import { Linking, ToastAndroid } from 'react-native';

export const handleExternalUrl = url =>  
    Linking.canOpenURL(url)
            .then(supported => supported && Linking.openURL(url))
            // todo: show error toast or snackbar
            .catch(err => ToastAndroid.show(`Your device can't handle this link :(`, ToastAndroid.SHORT));