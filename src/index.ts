import { FAlexa, Unlistener } from 'falexa';
import { BimboConnection } from './bimbo';
import { Recognition } from 'falexa/lib/src/falexa';
const connect = <() => BimboConnection>
// tslint:disable-next-line:no-any no-unsafe-any no-require-imports
    (require('./bimboConnection').connect);

export interface BotsAndBimbos {
    startBotListener(): Unlistener, // Pause Bimbos and make bot listen
    destroy(): void, // Destroy Bimbo connections
    setMuteOnListen(muteOnListen: boolean): void, // Whether to mute my microphone when 
}

export const createBotsAndBimbos =
    (falexa: FAlexa, recognizer: Recognition | undefined = undefined): BotsAndBimbos => {
        let connection: BimboConnection | null = connect()
        let muteOnBotListen = false

        const stopHandler = () => {
            if (connection !== null && muteOnBotListen) {
                connection.setMuted(false)
            }
            falexa.offListenStop(stopHandler)
        }

        return {
            startBotListener: (): Unlistener => {
                if (connection !== null && muteOnBotListen) {
                    connection.setMuted(true)
                }
                falexa.offListenStop(stopHandler)
                falexa.onListenStop(stopHandler)
                return falexa.listen(recognizer)
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
