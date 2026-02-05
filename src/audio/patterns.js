export const PATTERNS = {
    bassArrangement: {
        original: 'note("c2 [e2 g2] c3 [e2 g2]").s("gm_synth_bass_1").lpf(800)',
        trance: 'note("c2!4").s("sawtooth").lpf(sine.range(400, 2000).slow(4)).gain(0.6)',
        tuba: 'note("c2 c3 c2 c3").s("tuba")',
        strings: 'note("c2 e2 g2 c3").s("gm_string_ensemble_1").lpf(600)',
        silence: '""'
    },
    drumArrangement: {
        original: 's("bd ~ cp ~").bank("RolandTR909")',
        syncopated: 's("~ bd [~ cp] bd").bank("RolandTR909")',
        fourOnTheFloor: 's("bd!4").bank("RolandTR909")',
        casio: 's("bd ~ sd ~").bank("CasioRZ1")',
        basicTick: 's("~ ~ tick ~")'
    },
    leadArrangement: {
        techno: 'note("c5 ~ eb5 ~").s("sawtooth").lpf(2000).gain(0.5)',
        epiano: 'note("g4 c5 e5 g5").s("RhodesElectricPiano")',
        organ: 'note("c4 e4 g4 c5").s("gm_church_organ").gain(0.4)',
        original: 'note("~ [g4 c5] ~ [eb5 g5]").s("sawtooth").lpf(sine.range(800, 3000).slow(8)).ad(0.1, 0.3)',
        silence: '""',
        banjo: 'note("c4 e4 g4 c5").s("banjo")'
    }
};
