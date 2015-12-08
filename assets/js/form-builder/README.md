Form Builder
============

The Form Builder is a Backbone app all its own. Think of it as an entirely different
site from the rest of the gh-pages documentation site. It just lives nestled under
the Form Builder tab.

/collections
    Backbone Collections used to store available components (components in the
    form builder which can be added to your form) and placed components (components
    in the form builder which _have been_ added to your form).

    These are data constructs used to _hold_ these collections only, and do not
    actually _define_ these collections. That defining is done `app.js`

/data
    JSON data structures used to define available Form Builder components.
    Currently each tab in the Form Builder gets its own data structure for convenience
    sake.

    This data structure is used to populate the tab in the Form Builder named after
    this file.

    Each Object in the array corresponds with a component in that tab.

    {
        title - 'My Title' gets translated into 'my_title', which corresponds with
                a variable in /templates/component/component-templates.js, the variable
                contains a pointer to a file in /templates/component/ with a similar
                name to `my-title` (with a dash instead of an underscore). The
                variable is used by `app.js` to add the component to the Form Builder
        fields - When you click on an element that has been added to your form,
                a popover appears which allows you to edit component properties.
                These fields are used to populate those properties.

        {
            [id] - Each field has an ID. This represents the name of a variable
                    where the selection will be stored and which will be made
                    available to your underscore templates.
            {
                type - What sort of form control should be used to make the selection
                        to define this field's attributes. Templates for these form
                        controls are found in /assets/js/form-builder/templates/popover/
                        Options currently are:
                            checkbox
                            input
                            number
                            select
                            textarea-split
                            textarea
                label - The label displayed above the form control which will tell the
                        user what the form control is actually for.
                value - The value displayed in the form control. Broken down as follows:
                    checkbox - boolean (whether the checkbox is checked)
                    input/textarea - default text
                    number - integer representing initial value of spinner
                    select - [array] of {objects}, as follows:
                        [
                            {
                                label - value displayed to user
                                value - actual value chosen if option is selected
                                selected - whether the option defaults as being selected
                                            only one should be set to `true`
                            }
                        ]
                    textarea-split - [array] of strings. Each string will be placed
                                    on its own line within the text area.
            }
        }
    }


/helper/pubsub.js
    Not really sure what this is. I think it handles event binding somehow

/models
    Backbone models used in the Form Builder

/templates
    /app
        Templates used for the app itself
    /component
        Form Builder components. TODO: move these templates into a git submodule
                                        so they can be shared across projects.
    /component/component-templates.js
        Registers the component templates with the Form Builder.
    /popover
        Templates used to create the popovers in Form Builder when you click
        on a placed component.

/views
    Backbone views for the Form Builder

/app.js
    Kicks the whole thing off.
