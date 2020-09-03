module.exports = function (RED) {
    function RandomItemNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function (msg) {
            const array = getArray(config.inputType, config.input, msg);

            if (!Array.isArray(array)) {
                node.error(`Input is not a valid array`, msg);
                node.status({
                    fill: 'red',
                    shape: 'ring',
                    text: 'invalid array',
                });
                return;
            }

            if (array.length === 0) {
                node.error(`Input is an empty array`, msg);
                node.status({
                    fill: 'red',
                    shape: 'ring',
                    text: 'empty array',
                });
                return;
            }

            let randomItems = [];
            const maxLoops = Math.min(config.number || 1, array.length);

            for (let i = 0; i < maxLoops; i++) {
                const index = Math.floor(Math.random() * array.length);
                randomItems = [...randomItems, ...array.splice(index, 1)];
            }

            const contextKey = RED.util.parseContextStore(config.output);
            const payload =
                randomItems.length === 1 ? randomItems[0] : randomItems;

            switch (config.outputType) {
                case 'flow':
                case 'global':
                    node.context()[config.outputType].set(
                        contextKey.key,
                        payload,
                        contextKey.store
                    );
                    break;
                case 'msg':
                default:
                    RED.util.setObjectProperty(msg, contextKey.key, payload);
                    break;
            }

            node.status({
                fill: 'green',
                shape: 'dot',
                text: JSON.stringify(payload),
            });

            node.send(msg);
        });
    }

    function getArray(location, property, message) {
        if (location === 'msg') {
            return RED.util.getMessageProperty(message, property);
        } else if (location === 'json') {
            try {
                return JSON.parse(property);
            } catch (e) {
                return property;
            }
        } else if (location === 'jsonata') {
            try {
                return RED.util.prepareJSONataExpression(property, node);
            } catch (e) {
                node.error(
                    RED._('change.errors.invalid-expr', { error: e.message })
                );
                return;
            }
        } else if (location === 'env') {
            return RED.util.evaluateNodeProperty(property, 'env', node);
        }

        const contextKey = RED.util.parseContextStore(property);
        return message
            .context()
            [location].get(contextKey.key, contextKey.store);
    }

    RED.nodes.registerType('random-item', RandomItemNode);
};
