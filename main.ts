radio.onReceivedNumber(function (receivedNumber) {
    if (receivedNumber == 11) {
        LinkStatus = true
        sistSettAktiv = input.runningTime()
    }
    if (receivedNumber == 21) {
        IgniterStatusLP = true
    } else if (receivedNumber == 22) {
        IgniterStatusLP = false
    }
    if (receivedNumber == 31) {
        ArmStatusLP = true
    } else if (receivedNumber == 32) {
        ArmStatusLP = false
    }
})
function Launch () {
    if (Klar) {
        BuzzerBlink()
        basic.showLeds(`
            . . # . .
            . # # # .
            # . # . #
            . . # . .
            . . # . .
            `)
        radio.sendNumber(42)
        strip.clear()
        strip.show()
        while (pins.digitalReadPin(DigitalPin.P1) == 0) {
            pins.digitalWritePin(DigitalPin.P8, 1)
            basic.showLeds(`
                . . . . .
                . # # # .
                . # # # .
                . # # # .
                . . . . .
                `)
            pins.digitalWritePin(DigitalPin.P8, 0)
            basic.showLeds(`
                . . . . .
                . # # # .
                . # . # .
                . # # # .
                . . . . .
                `)
        }
        pins.digitalWritePin(DigitalPin.P8, 0)
        Initialize()
    }
}
function Initialize () {
    SelfStatus = false
    LinkStatus = false
    IgniterStatusLP = false
    ArmStatusLP = false
    ArmStatus = false
    Klar = false
    strip.showColor(neopixel.colors(NeoPixelColors.Purple))
    basic.showLeds(`
        . . . . .
        . . . . .
        . . # . .
        . . . . .
        . . . . .
        `)
    basic.showLeds(`
        . . . . .
        . # # # .
        . # . # .
        . # # # .
        . . . . .
        `)
    basic.showLeds(`
        # # # # #
        # . . . #
        # . . . #
        # . . . #
        # # # # #
        `)
    basic.showLeds(`
        # . . . #
        # # . # #
        # . # . #
        # . . . #
        # . . . #
        `)
    strip.showColor(neopixel.colors(NeoPixelColors.Red))
    basic.pause(200)
}
function BuzzerBlink () {
    pins.digitalWritePin(DigitalPin.P13, 1)
    pins.digitalWritePin(DigitalPin.P14, 1)
    basic.pause(200)
    pins.digitalWritePin(DigitalPin.P13, 0)
    pins.digitalWritePin(DigitalPin.P14, 0)
    basic.pause(200)
    pins.digitalWritePin(DigitalPin.P13, 1)
    pins.digitalWritePin(DigitalPin.P14, 1)
    basic.pause(200)
    pins.digitalWritePin(DigitalPin.P13, 0)
    pins.digitalWritePin(DigitalPin.P14, 0)
    basic.pause(200)
    pins.digitalWritePin(DigitalPin.P13, 1)
    pins.digitalWritePin(DigitalPin.P14, 1)
    basic.pause(200)
    pins.digitalWritePin(DigitalPin.P13, 0)
    pins.digitalWritePin(DigitalPin.P14, 0)
}
let ArmStatus = false
let SelfStatus = false
let Klar = false
let ArmStatusLP = false
let IgniterStatusLP = false
let sistSettAktiv = 0
let LinkStatus = false
let strip: neopixel.Strip = null
radio.setGroup(1)
radio.setTransmitPower(7)
strip = neopixel.create(DigitalPin.P0, 5, NeoPixelMode.RGB)
pins.digitalWritePin(DigitalPin.P15, 1)
let Oppdateringsfrekvens = 200
Initialize()
basic.forever(function () {
    SelfStatus = true
    if (pins.digitalReadPin(DigitalPin.P1) == 0) {
        ArmStatus = true
        pins.digitalWritePin(DigitalPin.P13, 1)
    } else {
        ArmStatus = false
        pins.digitalWritePin(DigitalPin.P13, 0)
    }
    if (pins.digitalReadPin(DigitalPin.P11) == 0) {
        Launch()
    }
    if (SelfStatus && LinkStatus && IgniterStatusLP && ArmStatusLP && ArmStatus) {
        Klar = true
        basic.showLeds(`
            # . . . #
            . # . # .
            . . # . .
            . # . # .
            # . . . #
            `)
    } else {
        Klar = false
        basic.showLeds(`
            # . . . #
            # # . # #
            # . # . #
            # . . . #
            # . . . #
            `)
    }
    basic.pause(100)
})
control.inBackground(function () {
    while (true) {
        radio.sendNumber(11)
        if (input.runningTime() - sistSettAktiv > 3 * Oppdateringsfrekvens) {
            LinkStatus = false
            IgniterStatusLP = false
            ArmStatusLP = false
        }
        basic.pause(Oppdateringsfrekvens)
    }
})
