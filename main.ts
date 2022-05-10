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
function NeoPixels () {
    if (SelfStatus) {
        strip.setPixelColor(0, neopixel.colors(NeoPixelColors.Green))
    } else {
        strip.setPixelColor(0, neopixel.colors(NeoPixelColors.Red))
    }
    if (LinkStatus) {
        strip.setPixelColor(1, neopixel.colors(NeoPixelColors.Green))
    } else {
        strip.setPixelColor(1, neopixel.colors(NeoPixelColors.Red))
    }
    if (IgniterStatusLP) {
        strip.setPixelColor(2, neopixel.colors(NeoPixelColors.Green))
    } else {
        strip.setPixelColor(2, neopixel.colors(NeoPixelColors.Red))
    }
    if (ArmStatusLP) {
        strip.setPixelColor(3, neopixel.colors(NeoPixelColors.Green))
    } else {
        strip.setPixelColor(3, neopixel.colors(NeoPixelColors.Red))
    }
    if (Klar) {
        strip.setPixelColor(4, neopixel.colors(NeoPixelColors.Green))
    } else {
        strip.setPixelColor(4, neopixel.colors(NeoPixelColors.Red))
    }
    strip.show()
}
function Launch () {
    if (Klar) {
        Klar = false
        basic.showLeds(`
            . . # . .
            . # # # .
            # . # . #
            . . # . .
            . . # . .
            `)
        radio.sendNumber(42)
        BuzzerBlink()
        strip.clear()
        strip.show()
        while (pins.digitalReadPin(DigitalPin.P1) == 0) {
            pins.digitalWritePin(DigitalPin.P8, 0)
            basic.showLeds(`
                . . . . .
                . # # # .
                . # . # .
                . # # # .
                . . . . .
                `)
            pins.digitalWritePin(DigitalPin.P8, 1)
            basic.showLeds(`
                . . . . .
                . # # # .
                . # # # .
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
    for (let index = 0; index < 4; index++) {
        pins.digitalWritePin(DigitalPin.P13, 1)
        pins.digitalWritePin(DigitalPin.P14, 1)
        basic.pause(100)
        pins.digitalWritePin(DigitalPin.P13, 0)
        pins.digitalWritePin(DigitalPin.P14, 0)
        basic.pause(100)
    }
}
let ArmStatus = false
let Klar = false
let SelfStatus = false
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
    } else {
        ArmStatus = false
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
    if (Klar) {
        pins.digitalWritePin(DigitalPin.P13, 1)
        pins.digitalWritePin(DigitalPin.P14, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P13, 0)
        pins.digitalWritePin(DigitalPin.P14, 0)
    }
    NeoPixels()
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
