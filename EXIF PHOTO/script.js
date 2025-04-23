document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const exifContainer = document.getElementById('exifContainer');

    // Gestione del drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#2980b9';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '#3498db';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#3498db';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            processFile(file);
        }
    });

    // Gestione del click sul pulsante di upload
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    });

    function processFile(file) {
        // Aggiorna le informazioni base del file
        document.getElementById('fileName').textContent = file.name;
        document.getElementById('fileSize').textContent = formatFileSize(file.size);
        document.getElementById('mimeType').textContent = file.type;

        // Leggi i dati EXIF
        EXIF.getData(file, function() {
            const exifData = EXIF.getAllTags(this);
            
            // Informazioni Base
            document.getElementById('resolution').textContent = 
                `${exifData.XResolution || '-'} x ${exifData.YResolution || '-'} DPI`;

            // Dati Fotografici
            document.getElementById('camera').textContent = 
                `${exifData.Make || ''} ${exifData.Model || ''}`.trim() || '-';
            document.getElementById('lens').textContent = exifData.LensModel || '-';
            document.getElementById('focalLength').textContent = 
                exifData.FocalLength ? `${exifData.FocalLength}mm` : '-';
            document.getElementById('aperture').textContent = 
                exifData.FNumber ? `f/${exifData.FNumber}` : '-';
            document.getElementById('exposure').textContent = 
                exifData.ExposureTime ? `${exifData.ExposureTime}s` : '-';
            document.getElementById('iso').textContent = exifData.ISOSpeedRatings || '-';
            document.getElementById('exposureCompensation').textContent = 
                exifData.ExposureBiasValue ? `${exifData.ExposureBiasValue} EV` : '-';
            document.getElementById('exposureMode').textContent = 
                getExposureMode(exifData.ExposureMode);
            document.getElementById('meteringMode').textContent = 
                getMeteringMode(exifData.MeteringMode);

            // Impostazioni Fotografiche
            document.getElementById('whiteBalance').textContent = 
                getWhiteBalance(exifData.WhiteBalance);
            document.getElementById('flash').textContent = 
                getFlashInfo(exifData.Flash);
            document.getElementById('imageStabilization').textContent = 
                exifData.ImageStabilization ? 'Attiva' : 'Non disponibile';
            document.getElementById('imageFormat').textContent = 
                exifData.ImageFormat || '-';
            document.getElementById('imageQuality').textContent = 
                exifData.ImageQuality || '-';

            // Dati GPS
            if (exifData.GPSLatitude && exifData.GPSLongitude) {
                document.getElementById('latitude').textContent = 
                    convertGPSCoordinates(exifData.GPSLatitude, exifData.GPSLatitudeRef);
                document.getElementById('longitude').textContent = 
                    convertGPSCoordinates(exifData.GPSLongitude, exifData.GPSLongitudeRef);
            } else {
                document.getElementById('latitude').textContent = '-';
                document.getElementById('longitude').textContent = '-';
            }
            document.getElementById('altitude').textContent = 
                exifData.GPSAltitude ? `${exifData.GPSAltitude}m` : '-';
            document.getElementById('gpsDirection').textContent = 
                exifData.GPSImgDirection ? `${exifData.GPSImgDirection}°` : '-';
            document.getElementById('gpsSpeed').textContent = 
                exifData.GPSSpeed ? `${exifData.GPSSpeed} km/h` : '-';

            // Dati Temporali
            if (exifData.DateTimeOriginal) {
                const date = new Date(exifData.DateTimeOriginal);
                document.getElementById('dateTaken').textContent = 
                    date.toLocaleDateString('it-IT');
                document.getElementById('timeTaken').textContent = 
                    date.toLocaleTimeString('it-IT');
            } else {
                document.getElementById('dateTaken').textContent = '-';
                document.getElementById('timeTaken').textContent = '-';
            }
            document.getElementById('timezone').textContent = 
                exifData.TimeZoneOffset || '-';

            // Dati Avanzati
            document.getElementById('software').textContent = 
                exifData.Software || '-';
            document.getElementById('copyright').textContent = 
                exifData.Copyright || '-';
            document.getElementById('description').textContent = 
                exifData.ImageDescription || '-';
            document.getElementById('keywords').textContent = 
                exifData.Keywords || '-';

            // Mostra il container dei dati EXIF
            exifContainer.style.display = 'block';
        });
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function convertGPSCoordinates(coordinates, ref) {
        if (!coordinates) return '-';
        
        const degrees = coordinates[0];
        const minutes = coordinates[1];
        const seconds = coordinates[2];
        
        let decimal = degrees + minutes / 60 + seconds / 3600;
        
        if (ref === 'S' || ref === 'W') {
            decimal = -decimal;
        }
        
        return decimal.toFixed(6) + '°';
    }

    function getExposureMode(mode) {
        const modes = {
            0: 'Automatico',
            1: 'Manuale',
            2: 'Auto Bracket'
        };
        return modes[mode] || '-';
    }

    function getMeteringMode(mode) {
        const modes = {
            0: 'Sconosciuto',
            1: 'Media',
            2: 'Centro',
            3: 'Spot',
            4: 'Multi-spot',
            5: 'Pattern',
            6: 'Parziale',
            255: 'Altro'
        };
        return modes[mode] || '-';
    }

    function getWhiteBalance(balance) {
        const balances = {
            0: 'Auto',
            1: 'Manuale',
            2: 'Nuvoloso',
            3: 'Soleggiato',
            4: 'Fluorescente',
            5: 'Tungsteno',
            6: 'Flash',
            7: 'Personalizzato'
        };
        return balances[balance] || '-';
    }

    function getFlashInfo(flash) {
        if (!flash) return 'Non presente';
        
        const fired = (flash & 1) ? 'Attivato' : 'Non attivato';
        const mode = (flash & 6) >> 1;
        const modes = {
            0: 'Sconosciuto',
            1: 'Compulsivo',
            2: 'Compulsivo con riduzione occhi rossi',
            3: 'Compulsivo con sincronizzazione lenta'
        };
        
        return `${fired} - ${modes[mode] || 'Modalità sconosciuta'}`;
    }
}); 