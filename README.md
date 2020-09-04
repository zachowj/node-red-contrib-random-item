[![Release Version][release-shield]][release-link] [![License][license-shield]](LICENSE.md)

[![BuyMeCoffee][buymecoffee-shield]][buymecoffee-link]

# node-red-contrib-random-item

A Node-RED node that selects a random item from an array.

## Install

Run the following command in your Node-RED user directory - typically ~/.node-red

```
npm i node-red-contrib-random-item
```

## Usage

A node that selects a random item from an array.

### Inputs

Input needs to be in a JSON formatted array.

Examples of inputs:

```json
["first", "second", "third", "fourth"]
```

```json
[1, 2, 3, 4, 5]
```

```json
[
  { "name": "George Jetson", "role": "father" },
  { "name": "Jane Jetson", "role": "mother" },
  { "name": "Judy Jetson", "role": "daugter" },
  { "name": "Elroy Jetson", "role": "son" }
]
```

### Outputs

Output will either be a single data type or an array of items if the `Max # of items` is greater than one.

## Find Us

- [GitHub](https://github.com/zachowj/node-red-contrib-random-item)
- [Node-RED](https://flows.nodered.org/node/node-red-contrib-random-item)
- [npm](https://www.npmjs.com/package/node-red-contrib-random-item)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the
[tags on this repository](https://github.com/zachowj/node-red-contrib-random-item/tags).

## Authors

- [zachowj](https://github.com/zachowj) - _Initial work_

See also the list of [contributors](https://github.com/zachowj/node-red-contrib-random-item/contributors) who
participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

[license-shield]: https://img.shields.io/github/license/zachowj/node-red-contrib-random-item.svg?style=for-the-badge
[release-link]: https://github.com/zachowj/node-red-contrib-random-item/releases
[release-shield]: https://img.shields.io/github/v/release/zachowj/node-red-contrib-random-item?style=for-the-badge
[buymecoffee-link]: https://www.buymeacoffee.com/zachowj
[buymecoffee-shield]: https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png
