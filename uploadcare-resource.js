theme.liquid
{% if request.page_type == 'product' %}
    <script src="https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js"></script>
    <script src="{{ 'uploadcare.js' | asset_url }}" defer="defer"></script>
    {{ 'uploadcare.scss.css' | asset_url | stylesheet_tag }}
{% endif %}

uploadcare.scss
.product-single__photo img {
    width: 100%;
}
/*landscape*/
[data-size="mm10x8"] {
    width: 60%;
}
[data-size="mm14x11"] {
    width: 65%;
}
[data-size="mm16x12"] {
    width: 70%;
}
[data-size="mm18x12"] {
    width: 75%;
}
[data-size="mm20x16"] {
    width: 80%;
}
[data-size="mm24x16"] {
    width: 85%;
}
[data-size="mm24x18"] {
    width: 90%;
}
[data-size="mm36x24"] {
    width: 95%;
}
[data-size="mm48x32"] {
    width: 100%;
}
/*portrait*/
[data-size="mm8x10"] {
    width: 35%;
}
[data-size="mm11x14"] {
    width: 39%;
}
[data-size="mm12x16"] {
    width: 43%;
}
[data-size="mm12x18"] {
    width: 47%;
}
[data-size="mm16x20"] {
    width: 51%;
}
[data-size="mm16x24"] {
    width: 55%;
}
[data-size="mm18x24"] {
    width: 59%;
}
[data-size="mm24x36"] {
    width: 63%;
}
[data-size="mm32x48"] {
    width: 67%;
}
/*square*/
[data-size="mm12x12"] {
    width: 30%;
}
[data-size="mm16x16"] {
    width: 70%;
}
[data-size="mm24x24"] {
    width: 100%;
}

product-template.liquid
{% assign handleProduct = product.handle %}
            {% if product.available and product.variants.size > 1 %}
                {% include 'uploadcare-fields' with 'Size' as swatch %}
            {% endif %}

uploadcare-fields.liquid [snippets]
{% assign handle = handleProduct %}
{% case handle %}
    {% when 'horizontal-canvas-prints' %}
        {% assign crop = '3:2' %}
    {% when 'gallery-wrapped-canvas' %}
        {% assign crop = '2:3' %}
    {% when 'square-canvas-prints' %}
        {% assign crop = '1:1' %}
    {% else %}
        {% assign crop = 'free' %}
{% endcase %}

<p class="cart-attribute__field uploader-debut">
  <input id="uploader" type="hidden" data-images-only='true' data-crop="{{crop}}" role="uploadcare-uploader" name="properties[custom image]" value="{{ properties['custom image'] }}">
</p>
<script>
    var productHandle = '{{handleProduct}}';
    var swatch = '{{swatch}}';
</script>
