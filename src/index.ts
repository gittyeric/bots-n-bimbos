import { FAlexa } from 'falexa';
import { BimboConnection } from './bimbo';
const connect = <() => BimboConnection>
// tslint:disable-next-line:no-any no-unsafe-any no-require-imports
    (require('./bimboConnection').connect);

export interface BotsAndBimbos {
    startBotListener(): void, // Pause Bimbos and make bot listen
    destroy(): void, // Destroy Bimbo connections
    setMuteOnListen(muteOnListen: boolean): void, // Whether to mute my microphone when 
}

export const createBotsAndBimbos =
    (falexa: FAlexa): BotsAndBimbos => {
        let connection: BimboConnection | null = connect()
        let muteOnBotListen = false

        const stopHandler = () => {
            if (connection !== null && muteOnBotListen) {
                connection.setMuted(false)
            }
            falexa.offListenStop(stopHandler)
        }

        return {
            startBotListener: () => {
                if (connection !== null && muteOnBotListen) {
                    connection.setMuted(true)
                }
                falexa.offListenStop(stopHandler)
                falexa.onListenStop(stopHandler)
                falexa.startListening()
            },
            destroy: () => {
                if (connection !== null) {
                    connection.destroy()
                    connection = null
                }
            },
            setMuteOnListen: (muteOnListen: boolean) => {
                muteOnBotListen = muteOnListen
            },
        }
    }
