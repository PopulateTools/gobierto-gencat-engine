# Gobierto Gencat Engine
The purpose of this engine is to override views and styles of hosting gobierto application.

## Usage


## Installation
Previously you have to set `DEV_DIR` environment variable. Local gobierto application must be
under this path, i.e. the gobierto path must be `$DEV_DIR/gobierto`

Clone this repo and run `script/setup.sh`. It will create the following symbolic link in local
gobierto path: `$DEV_DIR/gobierto/vendor/gobierto_engines/gobierto-gencat-engine`.

After that, `gobierto-gencat-engine` will be available as theme in a site. Go to the
destination site configuration in admin and set `gobierto-gencat-engine` in "engine overrides param"
attribute

## Configuration

In order to use this engine you need to:

- use a Gobierto Data account to store trips. The data can be obtained [from this
  pipeline](https://github.com/PopulateTools/gobierto-etl-gencat/blob/master/pipelines/import_agendas/Jenkinsfile#L59-L75)

- use a site configuration variable named `mapbox_token` to provide the token to render the base map

## Contributing
Contribution directions go here.

## License
The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
