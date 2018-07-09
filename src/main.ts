import { Falexa } from 'falexa';
import { BimboSettings } from './bimbo';

export interface BotsAndBimbos {
    startBotListener: () => void
}

const initBimbosConnection = (settings: BimboSettings): Promise<boolean> => {
    return Promise.resolve(true)
}

const startBimbosListening = () => {

}

export const botsAndBimbos = (falexa: Falexa, bimboSettings: BimboSettings) => {
    initBimbosConnection(bimboSettings).then((res: boolean) => {
        
    })

    return {
        startBotListener: () => {
            falexa.startListening()
        }
    }
}
