import Application from '../Application.js'

const handler = (argv) => {
    const app = new Application(argv)
    app.start()
}

const ScanCommand = {
    command: ['scan', '$0'],
    desc: 'Scan a network',
    builder: {},
    handler,
}

export default ScanCommand
