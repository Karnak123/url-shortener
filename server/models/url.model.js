const mongoose = require('mongoose');

const UrlModel = mongoose.model('Url',
mongoose.Schema(
    {
        slug: {
            type: String,
            minLength: [5, 'Slug does not contain enough characters (Minimum 5).'],
            maxLength: [5, 'Slug contains too many characters (Maximum 5).'],
            trim: true,
            validate: {
                validator: (slug) => {
                    return /[\w\-]/.test(slug);
                },
                message: props => `${props.value} is not a valid slug`
            }
        },
        url: {
            type: String,
            required: [true, 'A valid URL must be provided.'],
            trim: true
        }
    },
    {timestamps: true}
));

module.exports = UrlModel;