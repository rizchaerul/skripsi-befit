export function getRelativeTime(date: Date) {
    let unit = "s";

    let diff: number = (Date.now() - date.getTime()) / 1000;
    diff = Math.floor(diff);

    // Minute
    if (diff >= 60) {
        unit = "m";

        diff = diff / 60;
        diff = Math.floor(diff);

        // Hour
        if (diff >= 60) {
            unit = "h";

            diff = diff / 60;
            diff = Math.floor(diff);

            // Day
            if (diff >= 24) {
                unit = "d";

                diff = diff / 24;
                diff = Math.floor(diff);

                // Month
                if (diff >= 31) {
                    unit = "m";

                    diff = diff / 31;
                    diff = Math.floor(diff);

                    // Year
                    if (diff >= 12) {
                        unit = "m";

                        diff = diff / 12;
                        diff = Math.floor(diff);
                    }
                }
            }
        }
    }

    return diff + unit;
}
