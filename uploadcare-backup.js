
const frameOptions = {
    'Oak': 'oak',
    'Cherry': 'cherry',
    'Walnut': 'walnut'
};
// populate the frame size depnding on image size selected
const sizeOptions = {
    '12x12': '250x250',
    '18x18': '300x300',
    '24x24': '400x400',
    '12x8': '270x170',
    '18x12': '400x260',
    '27x18': '540x340',
    '8x12': '170x270',
    '12x18': '260x400',
    '18x27': '340x540'
}

const formatOptions = {
    Landscape: '3:2', //'16:9',
    Portrait: '2:3', // 8:13
    Square: '1:1'
};

var uploadcareFeature = {
    productHandled: productHandle,
    uploadedImage: null,
    selectedSize: '',
    selectedFrame: '',
    selectedFormat: '',

    init: function(settings) {
        uploadcareFeature.config = {
            // default var
            currentFrame: '',
            currentSize: '',
            currentFormat: '',
            currentOverlay: '',

            resetFiled: $('#reset-fields'),
            // upload widget
            uploader: $('[role=uploadcare-uploader]'),
            uploadCareButton: $('.uploadcare--widget__button'),
            customUploader: $('#customUploader'),
            // product image
            productImage: $('.product-featured-media'),
            productImageWrapper: $('.product-single__media'),
            // varient options
            sizeSelector: $('[data-option=size]'),
            frameSelector: $('[data-option=frame]'),
            formatSelector: $('[data-option="format"]'),
            // buttons
            addToCartButton: $('[type=submit]'),
            googlePayButton: $('[data-testid="GooglePay-button"]'),
        };

        // Allow overriding the default config
        $.extend(uploadcareFeature.config, settings);

        // setup uploadcare key
        UPLOADCARE_MANUAL_START = uploadcareFeature.config.uploadcareManual;
        UPLOADCARE_DO_NOT_STORE = uploadcareFeature.config.uploadcareStore;
        UPLOADCARE_PUBLIC_KEY = uploadcareFeature.config.uploadcareKey;
        
        // setup uploadcare environment
        uploadcareFeature.setupUploadCare();
    },

    setupUploadCare: function() {
        // set initial frame
        // uploadcareFeature.setFrame(frameOptions[uploadcareFeature.config.currentFrame]);

        
        uploadcareFeature.resetFields();
        // frame change event listener
        uploadcareFeature.config.formatSelector.on('change', function(e) {
            var selectedForamt = $(this).children("option:selected").val();
            if (selectedForamt) {
                uploadcareFeature.setFormat(formatOptions[selectedForamt]);
                uploadcareFeature.setSize(sizeOptions[uploadcareFeature.config.sizeSelector.find('option:eq(1)').val()]);
                uploadcareFeature.populateStyle();
            }
        });

        // size change event listener
        uploadcareFeature.config.sizeSelector.on('change', function(e) {
            var selectedSize = $(this).children("option:selected").val();
            if (selectedSize) {
                uploadcareFeature.setSize(sizeOptions[selectedSize]);
                uploadcareFeature.populateStyle();
            }
        });

        // frame change event listener
        uploadcareFeature.config.frameSelector.on('change', function(e) {
            var selectedFrame = $(this).children("option:selected").val();
            if (selectedFrame) {
                uploadcareFeature.setFrame(frameOptions[selectedFrame]);
                uploadcareFeature.populateStyle();
            }
        });

        // uploadcareFeature.config.resetFiled.on('click', function(e) {
        //     var uri = window.location.href.toString();
        //     if (uri.indexOf("?") > 0) {
        //         var clean_uri = uri.substring(0, uri.indexOf("?"));
        //         window.history.replaceState({}, document.title, clean_uri);
        //     }
        //     // location.reload(true);
        // });
    },

    resetFields: function() {
        // reset all actions
        uploadcareFeature.config.uploadCareButton.prop('disabled', true);
        uploadcareFeature.config.addToCartButton.prop('disabled', true);
        uploadcareFeature.config.googlePayButton.prop('disabled', true);

        // reset all selectors
        uploadcareFeature.config.sizeSelector.prop('disabled', true);
        uploadcareFeature.config.frameSelector.prop('disabled', true);
    },

    setFormat: function(selectedFormat) {
        uploadcareFeature.config.currentFormat = selectedFormat;

        // populate size option filtering
        uploadcareFeature.populateSizes();
    },

    getFormat: function () {
        return uploadcareFeature.config.currentFormat;
    },

    populateSizes: function() {
        // initialize uploadcare
        uploadcareFeature.initializeUpload();

        // overide options
        var options = [];
        switch (uploadcareFeature.getFormat()) { 
            case '2:3': // portrait
                 options = [
                    {"name": '12x8'},
                    {"name": '18x12'},
                    {"name": '27x18'}
                ];
            break;
            case '3:2': // landscape
                options = [
                    {"name": '8x12'},
                    {"name": '12x18'},
                    {"name": '18x27'}
                ];

            break;
            default: // sqaure
                options = [
                    {"name": '12x12'},
                    {"name": '18x18'},
                    {"name": '24x24'}
                ];
        }

        // set empty initial value
        uploadcareFeature.config.sizeSelector.empty().append($('<option></option>').attr('value', '').text('Pick a size'));

        // loop trough
        $.each(options, function(key, entry) {
          uploadcareFeature.config.sizeSelector.append($('<option></option>').attr('value', entry.name).text(entry.name));
        });

        uploadcareFeature.config.sizeSelector.val(uploadcareFeature.getSize()).attr('selected', true);
        // triger event
        uploadcareFeature.config.sizeSelector.trigger('change');
    },

    initializeUpload: function() {

        // overrides uploadcare settings
        uploadcare.start({
            crop: uploadcareFeature.getFormat() // overrides UPLOADCARE_CROP
        });

        // assign widget
        const widget = uploadcare.SingleWidget(uploadcareFeature.config.uploader);

        // validate uploadcare
        widget.validators.push(uploadcareFeature.minResolution(800, 1200));

        // listen to uploadcare complate event
        widget.onUploadComplete(function (fileInfo) {

            // set uploadcare image
            uploadcareFeature.uploadedImage = fileInfo.cdnUrl;

            // disable selecting new format
            uploadcareFeature.config.formatSelector.prop('disabled', true);

            // enable selecting size
            uploadcareFeature.config.sizeSelector.prop('disabled', false);

            // populate styles
            uploadcareFeature.populateStyle();
        });

        // unsubscribe to widget instance
        widget.onUploadComplete();
        widget.onUploadComplete.remove();
    },

    minResolution: function(width, height) {
        return function(fileInfo) {
            var imageInfo = fileInfo.originalImageInfo;
            var resolution = width * height;
            if (imageInfo !== null) {
                if (imageInfo.width * imageInfo.height < resolution) {
                    throw new Error('resolution');
                }
            }
        };
    }, 

    setSize: function(selectedSize) {
        uploadcareFeature.config.currentSize = selectedSize;

        // disable selecting new size
        // uploadcareFeature.config.sizeSelector.prop('disabled', true);

        // enable selecting new frame
        uploadcareFeature.config.frameSelector.prop('disabled', false);
    },

    getSize: function () {
        return uploadcareFeature.config.currentSize;
    },

    setFrame: function(selectedFrame) {
        uploadcareFeature.config.currentFrame = selectedFrame;

        // enable buttons
        uploadcareFeature.config.addToCartButton.prop('disabled', false);
        uploadcareFeature.config.googlePayButton.prop('disabled', false);
        // if ($('#reset-fields').length) {
        //     $('#reset-fields').remove();
        // }
        // $('<button type="button" id="reset-fields">Reset</button>').prependTo('.product-form__controls-group--submit');
    },

    getFrame: function () {
        return uploadcareFeature.config.currentFrame;
    },

    setOverlay: function(overlaySelected) {
        uploadcareFeature.config.currentOverlay = overlaySelected;
    },

    getOverlay: function() {
        return uploadcareFeature.config.currentOverlay;
    },

    populateStyle: function() {
        // precheck if there is an upload image
        if (uploadcareFeature.uploadedImage) {
            // set initial upload without size options
            var uploadCareImage = uploadcareFeature.uploadedImage + '-/resize/';

            // populate upload with custom size
            if (uploadcareFeature.getSize()) {
                uploadCareImage += uploadcareFeature.getSize() + '/-/stretch/fill/';    
            }
            
            // populate upload with custom frames
            if (uploadcareFeature.getFrame()) {

                // check selected format
                switch(uploadcareFeature.getFormat()) {
                    case '2:3': // portrait
                        // check selected sizes
                        switch(uploadcareFeature.getSize()) {
                            case '400x260':
                                // check selected frames
                                switch(uploadcareFeature.getFrame()) {
                                    case 'cherry':
                                    uploadcareFeature.setOverlay('UUID for cherry 400x260 size');
                                    break;
                                    case 'walnut':
                                    uploadcareFeature.setOverlay('UUID for walnut 400x260 size');
                                    break;
                                    default: // oak
                                    uploadcareFeature.setOverlay('UUID for oak 400x260 size');
                                }
                            break;
                            case '540x340':
                                switch(uploadcareFeature.getFrame()) {
                                    case 'cherry':
                                    uploadcareFeature.setOverlay('UUID for cherry 540x340 size');
                                    break;
                                    case 'walnut':
                                    uploadcareFeature.setOverlay('UUID for walnut 540x340 size');
                                    break;
                                    default: // oak
                                    uploadcareFeature.setOverlay('UUID for oak 540x340 size');
                                }
                            break;
                            default: // 270x170
                                switch(uploadcareFeature.getFrame()) {
                                    case 'cherry':
                                    uploadcareFeature.setOverlay('UUID for cherry 270x170 size');
                                    break;
                                    case 'walnut':
                                    uploadcareFeature.setOverlay('UUID for walnut 270x170 size');
                                    break;
                                    default: // oak
                                    uploadcareFeature.setOverlay('UUID for oak 270x170 size');
                                }
                        }
                    break;
                    case '3:2': // landscape
                        switch(uploadcareFeature.getSize()) {
                            case '260x400':
                                switch(uploadcareFeature.getFrame()) {
                                    case 'cherry':
                                    uploadcareFeature.setOverlay('UUID for cherry 260x400 size');
                                    break;
                                    case 'walnut':
                                    uploadcareFeature.setOverlay('UUID for walnut 260x400 size');
                                    break;
                                    default: // oak
                                    uploadcareFeature.setOverlay('UUID for oak 260x400 size');
                                }
                            break;
                            case '340x540':
                                switch(uploadcareFeature.getFrame()) {
                                    case 'cherry':
                                    uploadcareFeature.setOverlay('UUID for cherry 340x540 size');
                                    break;
                                    case 'walnut':
                                    uploadcareFeature.setOverlay('UUID for walnut 340x540 size');
                                    break;
                                    default: // oak
                                    uploadcareFeature.setOverlay('UUID for oak 340x540 size');
                                }
                            break;
                            default: // 170x270
                                switch(uploadcareFeature.getFrame()) {
                                    case 'cherry':
                                    uploadcareFeature.setOverlay('UUID for cherry 170x270 size');
                                    break;
                                    case 'walnut':
                                    uploadcareFeature.setOverlay('UUID for walnut 170x270 size');
                                    break;
                                    default: // oak
                                    uploadcareFeature.setOverlay('UUID for oak 170x270 size');
                                }

                        }
                    break;
                    default: // 1:1
                        switch(uploadcareFeature.getSize()) {
                            case '300x300':
                                switch(uploadcareFeature.getFrame()) {
                                    case 'cherry':
                                        uploadcareFeature.setOverlay('547558d3-e1f8-4d73-a7a4-d95c71e7d983');
                                    break;
                                    case 'walnut':
                                        uploadcareFeature.setOverlay('9791d77e-6d60-42fc-94d5-07e6c00445bb');
                                    break;
                                    default: // oak
                                        uploadcareFeature.setOverlay('2fe62a17-fe41-46e8-969b-cf8dc7954131');
                                }
                            break;
                            case '400x400':
                                switch(uploadcareFeature.getFrame()) {
                                    case 'cherry':
                                        uploadcareFeature.setOverlay('c44e7060-fdbc-4a5b-bb85-38e969447dea');
                                    break;
                                    case 'walnut':
                                        uploadcareFeature.setOverlay('240c6f6a-ef7a-435a-8344-32d65ad95548');
                                    break;
                                    default: // oak
                                        uploadcareFeature.setOverlay('82041040-4239-4376-8a36-185cebd58490');
                                }
                            break;
                            default: // 250x250
                                switch(uploadcareFeature.getFrame()) {
                                    case 'cherry':
                                        uploadcareFeature.setOverlay('1d11cdc0-8c5e-4e13-a446-a2b8ae341467');
                                    break;
                                    case 'walnut':
                                        uploadcareFeature.setOverlay('b8754a2f-2d2d-4634-b018-58c99402417c');
                                    break;
                                    default: // oak
                                        uploadcareFeature.setOverlay('b8a46eec-e0af-4e50-92c0-7efc3da32ead');
                                }

                        }
                }
                
                uploadCareImage += '-/overlay/' + uploadcareFeature.getOverlay() + '/'
            }

            // https://ucarecdn.com/30ca702e-0627-4c70-a256-ec79304c4b11/-/crop/1158x1156/697,0/-/preview/-/resize/400x400/-/stretch/fill/-/overlay/82041040-4239-4376-8a36-185cebd58490/

            uploadcareFeature.config.productImage.attr('src', uploadCareImage);
            uploadcareFeature.config.productImage.attr('data-srcset', '');
            uploadcareFeature.config.productImage.attr('srcset', '');
        }
        
    }
};


uploadcareFeature.init({
    uploadcareKey: '6f6b3bed9c030dc28166',
    uploadcareManual: true,
    uploadcareStore: true
});
