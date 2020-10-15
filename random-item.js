const sampleSize = require('lodash.samplesize');

module.exports = function (RED) {
    function RandomItemNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', async (msg, send, done) => {
            // For maximum backwards compatibility, check that send exists.
            // If this node is installed in Node-RED 0.x, it will need to
            // fallback to using `node.send`
            send =
                send ||
                function () {
                    node.send.apply(node, arguments);
                };
            done =
                done ||
                function (err) {
                    if (err) {
                        node.error(err, msg);
                    }
                };

            try {
                const array = await getArray(
                    config.inputType,
                    config.input,
                    msg
                ).catch((err) => {
                    throw err;
                });

                if (!Array.isArray(array)) {
                    throw new Error('Input is not an array');
                }

                if (array.length === 0) {
                    throw new Error('Input is an empty array');
                }

                const count = Math.min(config.number || 1, array.length);
                const randomItems = sampleSize(array, count);
                const payload =
                    randomItems.length === 1 ? randomItems[0] : randomItems;

                await setContext(payload, msg).catch((err) => {
                    throw err;
                });

                node.status({
                    fill: 'green',
                    shape: 'dot',
                    text: JSON.stringify(payload),
                });
            } catch (err) {
                setStatusError(err.message);
                done(err);
                return;
            }

            send(msg);
            done();
        });

        function getArray(location, property, message) {
            return new Promise((resolve, reject) => {
                let val = property;
                switch (location) {
                    case 'env':
                        val = RED.util.evaluateNodeProperty(
                            property,
                            'env',
                            node
                        );
                        break;
                    case 'flow':
                    case 'global':
                        RED.util.evaluateNodeProperty(
                            property,
                            location,
                            node,
                            message,
                            (err, value) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(value);
                                }
                            }
                        );
                        return;
                    case 'json':
                        try {
                            val = JSON.parse(property);
                        } catch (e) {
                            reject('invalid json');
                        }
                        break;
                    case 'jsonata':
                        RED.util.evaluateJSONataExpression(
                            RED.util.prepareJSONataExpression(property, node),
                            message,
                            (err, value) => {
                                if (err) {
                                    reject(
                                        RED._('change.errors.invalid-expr', {
                                            error: err.message,
                                        })
                                    );
                                } else {
                                    resolve(value);
                                }
                            }
                        );
                        return;
                    case 'msg':
                        val = RED.util.getMessageProperty(message, property);
                        break;
                }

                resolve(val);
            });
        }

        function setContext(payload, msg) {
            return new Promise((resolve, reject) => {
                const contextKey = RED.util.parseContextStore(config.output);
                switch (config.outputType) {
                    case 'flow':
                    case 'global':
                        node.context()[config.outputType].set(
                            contextKey.key,
                            payload,
                            contextKey.store,
                            (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            }
                        );
                        break;
                    case 'msg':
                    default:
                        RED.util.setObjectProperty(
                            msg,
                            contextKey.key,
                            payload
                        );
                        break;
                }
                resolve();
            });
        }

        function setStatusError(text) {
            node.status({
                fill: 'red',
                shape: 'ring',
                text,
            });
        }
    }

    RED.nodes.registerType('random-item', RandomItemNode);
};
