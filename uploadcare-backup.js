var uploadcareFeature = {
  	productHandle: '',
    uploadedImage: null,
    croped: 'free',
    selectedSize: '',
    selectedEdge: '',
    selectedFrame: '',
    selectedOrientation: '',
  
    init: function( settings ) {
        uploadcareFeature.config = {
            productImage: $('.product-featured-img'),
          	inputUploader: $('#input-uploader'),
          	customUploader: $('#custom-uploader'),
          	sizeSelector: $('[data-option=size]'),
          	edgeSelector: $('[data-option="edge-option"]'),
          	frameSelector: $('[data-option=frame-color]'),
          	orientationSelector: $('[data-option=orientation]')
        };
 
        // Allow overriding the default config
        $.extend( uploadcareFeature.config, settings );
      	
        uploadcareFeature.setupUploadCare();
    },
  
    setupUploadCare: function() {

        uploadcareFeature.config.customUploader.prop('disabled', true);

        uploadcareFeature.config.customUploader.on('click', function() {
        	var dialog = uploadcare.openDialog(null, {
        		publicKey: uploadcareFeature.config.uploadcareKey,
	          	imagesOnly: uploadcareFeature.config.uploadcareImageOnly,
	          	crop: uploadcareFeature.croped
	      	}).done(function(response) {
	      		response.progress(function(result) {
	      			console.log(result.progress);
	                // $('#uploader-placeholder span').html(e.state);
	                // new uploadcare.Circle('#demo-circle').renderer.setValue(e.progress);
              	}).fail(function(result) {
					console.log(result);
				  // Dialog closed and no file or file group was selected.
				  // The result argument is either null, or the last selected file.
				}).done(function(result) {
	      			console.log(result);
	      			uploadcareFeature.uploadedImage = result.cdnUrl;
		            uploadcareFeature.config.productImage.attr('src', result.cdnUrl);
		            uploadcareFeature.config.productImage.attr('data-srcset', '');
		            uploadcareFeature.config.productImage.attr('srcset', '');
		          	
		          	uploadcareFeature.config.inputUploader.val(result.cdnUrl);
		          	// populate initial size
		          	uploadcareFeature.populateSize();
	      		})
	      	});
        });

        uploadcareFeature.config.sizeSelector.on('change', function() {
          	var size = $(this).children("option:selected").val();
          	if(size) {
				uploadcareFeature.config.customUploader.prop('disabled', false);
          	}

          	switch (uploadcareFeature.productHandle) {
              	case 'horizontal-canvas-prints': 
	                uploadcareFeature.onUpdateLandscapeSize(size);
	                break;
              	case 'gallery-wrapped-canvas': 
	                uploadcareFeature.onUpdatePortraitSize(size);
	                break;
              	case 'square-canvas-prints': 
	                uploadcareFeature.onUpdateSquareSize(size);
	                break;
	            case 'framed-print-with-mat-board': 
	                uploadcareFeature.onUpdateFrameBoardSize(size);
	                break;
               	case 'framed-canvas-prints': 
	                uploadcareFeature.onUpdateFrameCanvasSize(size);
	                break;
                case 'framed-print': 
	                uploadcareFeature.onUpdateFrameSize(size);
	                break;
                case 'acrylic-prints': 
	                uploadcareFeature.onUpdateAcrylicSize(size);
	                break;
              	default: // 10" wide x 8" tall
                uploadcareFeature.onUpdateSize(size);
            }
        });

        uploadcareFeature.config.edgeSelector.on('change', function() {
          	var edge = $(this).children("option:selected").val().replace(/\s+/g, '-').toLowerCase();
          	// uploadcareFeature.selectedEdge = edge;
          	uploadcareFeature.config.productImage.parent('div').attr('data-edge', edge);
        });

        uploadcareFeature.config.frameSelector.on('change', function() {
          	var frame = $(this).children("option:selected").val().replace(/\s+/g, '-').toLowerCase();
          	// uploadcareFeature.selectedFrame = frame
          	uploadcareFeature.config.productImage.parent('div').attr('data-frame', frame);
        });

        uploadcareFeature.config.orientationSelector.on('change', function() {
          	var orientation = $(this).children("option:selected").val();
          	switch (orientation) { 
              case '16" wide x 24" tall (photo size)': 
                uploadcareFeature.selectedOrientation = 'portrait';
                break;
                default: // 24" wide x 16" tall (photo size)
                uploadcareFeature.selectedOrientation = 'landscape';
            }

            uploadcareFeature.config.productImage.parent('div').attr('data-orientation', uploadcareFeature.selectedOrientation);
        });
    },
  	
    onUpdateLandscapeSize: function( callback ) { 
        switch (callback) { 
          case '14" wide x 11" tall': 
            uploadcareFeature.selectedSize = 'mm14x11';
            uploadcareFeature.croped = '14:11';
            break;
          case '16" wide x 12" tall': 
            uploadcareFeature.selectedSize = 'mm16x12';
            uploadcareFeature.croped = '4:3';
            break;
          case '18" wide x 12" tall': 
            uploadcareFeature.selectedSize = 'mm18x12';
            uploadcareFeature.croped = '3:2';
            break;    
          case '20" wide x 16" tall': 
            uploadcareFeature.selectedSize = 'mm20x16';
            uploadcareFeature.croped = '5:4';
            break;
          case '24" wide x 16" tall': 
            uploadcareFeature.selectedSize = 'mm24x16';
            uploadcareFeature.croped = '3:2';
            break;
          case '24" wide x 18" tall': 
            uploadcareFeature.selectedSize = 'mm24x18';
            uploadcareFeature.croped = '4:3';
            break;
          case '36" wide x 24" tall': 
            uploadcareFeature.selectedSize = 'mm36x24';
            uploadcareFeature.croped = '3:2';
            break;
          case '48" wide x 32" tall': 
            uploadcareFeature.selectedSize = 'mm48x32';
            uploadcareFeature.croped = '3:2';
            break;
          default: // 10" wide x 8" tall
            uploadcareFeature.selectedSize = 'mm10x8';
            uploadcareFeature.croped = '5:4';
        }
      	uploadcareFeature.populateSize();
    },
  
  	onUpdatePortraitSize: function( callback ) { 
        switch (callback) { 
          case '11" wide x 14" tall': 
            uploadcareFeature.selectedSize = 'mm11x14';
            uploadcareFeature.croped = '11:14';
            break;
          case '12" wide x 16" tall': 
            uploadcareFeature.selectedSize = 'mm12x16';
            uploadcareFeature.croped = '3:4';
            break;
          case '12" wide x 18" tall': 
            uploadcareFeature.selectedSize = 'mm12x18';
            uploadcareFeature.croped = '2:3';
            break;    
          case '16" wide x 20" tall': 
            uploadcareFeature.selectedSize = 'mm16x20';
            uploadcareFeature.croped = '4:5';
            break;
          case '16" wide x 24" tall': 
            uploadcareFeature.selectedSize = 'mm16x24';
            uploadcareFeature.croped = '2:3';
            break;
          case '18" wide x 24" tall': 
            uploadcareFeature.selectedSize = 'mm18x24';
            uploadcareFeature.croped = '3:4';
            break;
          case '24" wide x 36" tall': 
            uploadcareFeature.selectedSize = 'mm24x36';
            uploadcareFeature.croped = '2:3';
            break;
          case '32" wide x 48" tall': 
            uploadcareFeature.selectedSize = 'mm32x48';
            uploadcareFeature.croped = '2:3';
            break;
          default: // 8" wide x 10" tall
            uploadcareFeature.selectedSize = 'mm8x10';
            uploadcareFeature.croped = '4:5';
        }
      	uploadcareFeature.populateSize();
    },
  
  	onUpdateSquareSize: function( callback ) { 
        switch (callback) { 
          case '16" x 16"': 
            uploadcareFeature.selectedSize = 'mm16x16';
            uploadcareFeature.croped = '1:1';
            break;
          case '24" x 24"': 
            uploadcareFeature.selectedSize = 'mm24x24';
            uploadcareFeature.croped = '1:1';
            break;
          default: // 12" x 12"
            uploadcareFeature.selectedSize = 'mm12x12';
            uploadcareFeature.croped = '1:1';
        }
      	uploadcareFeature.populateSize();
    },

    onUpdateFrameBoardSize: function( callback ) { 
        switch (callback) { 
          case '24" wide x 16" tall (photo size)': 
            uploadcareFeature.selectedSize = 'mm24x16';
            uploadcareFeature.croped = '3:2';
            break;
          default: // 16" wide x 24" tall (photo size)
            uploadcareFeature.selectedSize = 'mm16x24';
            uploadcareFeature.croped = '2:3';
        }
      	uploadcareFeature.populateSize();
    },

  	onUpdateFrameCanvasSize: function( callback ) { 
  		switch (callback) { 
          case '16" wide x 24" tall': 
            uploadcareFeature.selectedSize = 'mm16x24';
            uploadcareFeature.croped = '2:3';
            break;
          case '24" wide x 16" tall': 
            uploadcareFeature.selectedSize = 'mm24x16';
            uploadcareFeature.croped = '3:2';
            break;
           case '24" x 24"': 
            uploadcareFeature.selectedSize = 'mm24x24';
            uploadcareFeature.croped = '1:1';
            break;
           case '24" wide x 36" tall': 
            uploadcareFeature.selectedSize = 'mm24x36';
            uploadcareFeature.croped = '2:3';
            break;
           case '36" wide x 24" tall': 
            uploadcareFeature.selectedSize = 'mm36x24';
            uploadcareFeature.croped = '3:2';
            break;
          default: // 16" x 16"
            uploadcareFeature.selectedSize = 'mm16x16';
            uploadcareFeature.croped = '1:1';
        }
      	uploadcareFeature.populateSize();
  	},

	onUpdateFrameSize: function( callback ) { 
		switch (callback) { 
          case '20" wide x 16" tall': 
            uploadcareFeature.selectedSize = 'mm20x16';
            uploadcareFeature.croped = '5:4';
            break;
          case '18" wide x 24" tall': 
            uploadcareFeature.selectedSize = 'mm18x24';
            uploadcareFeature.croped = '3:4';
            break;
           case '24" wide x 18" tall': 
            uploadcareFeature.selectedSize = 'mm24x18';
            uploadcareFeature.croped = '4:3';
            break;
          case '24" wide x 32" tall': 
            uploadcareFeature.selectedSize = 'mm24x32';
            uploadcareFeature.croped = '2:3';
            break;
           case '32" wide x 24" tall': 
            uploadcareFeature.selectedSize = 'mm32x24';
            uploadcareFeature.croped = '3:2';
            break;
          default: // 16" wide x 20" tall
            uploadcareFeature.selectedSize = 'mm16x20';
            uploadcareFeature.croped = '4:5';
        }
      	uploadcareFeature.populateSize();
    },

	onUpdateAcrylicSize: function( callback ) {
		switch (callback) { 
          case '24" wide x 16" tall': 
            uploadcareFeature.selectedSize = 'mm24x16';
            uploadcareFeature.croped = '3:2';
            break;
          case '20" wide x 30" tall': 
            uploadcareFeature.selectedSize = 'mm20x30';
            uploadcareFeature.croped = '2:3';
            break;
            case '30" wide x 20" tall': 
            uploadcareFeature.selectedSize = 'mm30x20';
            uploadcareFeature.croped = '3:2';
            break;
          case '24" wide x 36" tall': 
            uploadcareFeature.selectedSize = 'mm24x36';
            uploadcareFeature.croped = '2:3';
            break;
          case '36" wide x 24" tall': 
            uploadcareFeature.selectedSize = 'mm36x24';
            uploadcareFeature.croped = '3:2';
            break  
          default: // 16" wide x 24" tall
            uploadcareFeature.selectedSize = 'mm16x24';
            uploadcareFeature.croped = '2:3';
        }
      	uploadcareFeature.populateSize();
	},

  	onUpdateSize: function( callback ) { 
        if (uploadcareFeature.uploadedImage !== null) {
          	console.log('unhandled size');
        }
    },
  
  	populateSize: function() {
		// uploadcareFeature.config.productImage.parent('div').attr('data-size', uploadcareFeature.selectedSize);
	}
};

uploadcareFeature.productHandle = productHandle;

uploadcareFeature.init({
    uploadcareKey: '8c13765969bf80094f06',
  	uploadcareImageOnly: true,
  	uploadcareClearable: false,
  	uploadcareCanPreview: false
});