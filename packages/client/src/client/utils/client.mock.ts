import { Observable } from "rxjs"

const mockModule = () => {
  const { NEVER, defer } = require("rxjs")
  const { equals } = require("./equals")

  let registeredStreams: Array<[Array<any>, Observable<any>]> = []

  const getMatch = (type: string, args: any[]) => {
    const result =
      registeredStreams.find(
        ([[_type, ..._args]]) => _type === type && equals(_args, args),
      )?.[1] ?? NEVER
    return result
  }
  const watch$ = vi.fn((...args: any[]) => defer(() => getMatch("watch", args)))
  const getRemoteProcedureCall$ = vi.fn((...args: any[]) =>
    defer(() => getMatch("rpc", args)),
  )
  const getStream$ = vi.fn((...args: any[]) =>
    defer(() => getMatch("stream", args)),
  )

  return {
    whenWatch: (topic: string, stream: Observable<any>) => {
      registeredStreams.push([["watch", topic], stream])
    },
    whenStream: (
      service: string,
      operationName: string,
      payload: any,
      stream: Observable<any>,
    ) => {
      registeredStreams.push([
        ["stream", service, operationName, payload],
        stream,
      ])
    },
    whenRpc: (
      service: string,
      operationName: string,
      payload: any,
      stream: Observable<any>,
    ) => {
      registeredStreams.push([["rpc", service, operationName, payload], stream])
    },
    watch$,
    getRemoteProcedureCall$,
    getStream$,
    reset: () => {
      watch$.mockClear()
      getRemoteProcedureCall$.mockClear()
      getStream$.mockClear()
      registeredStreams = []
    },
  }
}

type MockedClient = ReturnType<typeof mockModule>

vi.mock("@/services/client", () => mockModule())

const mock = require("@/client/services/client") as MockedClient

export const {
  watch$,
  getRemoteProcedureCall$,
  getStream$,
  whenStream,
  whenRpc,
  whenWatch,
  reset,
} = mock
