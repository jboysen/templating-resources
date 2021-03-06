import './setup';
import {Container} from 'aurelia-dependency-injection';
import {bindingMode, BindingEngine, createScopeForTest} from 'aurelia-binding';
import {AttrBindingBehavior} from '../src/attr-binding-behavior';

describe('AttrBindingBehavior', () => {
  let bindingEngine, lookupFunctions;

  beforeAll(() => {
    const container = new Container();
    bindingEngine = container.get(BindingEngine);
    const bindingBehaviors = {
      attr: container.get(AttrBindingBehavior)
    };
    const valueConverters = {};
    lookupFunctions = {
      bindingBehaviors: name => bindingBehaviors[name],
      valueConverters: name => valueConverters[name]
    };
  });

  it('should bind attribute value', done => {
    const source = { foo: 'bar' };
    const scope = createScopeForTest(source);
    const target = document.createElement('div') as HTMLDivElement & { foo: any };
    const bindingExpression = bindingEngine.createBindingExpression('foo', `foo & attr`, bindingMode.toView, lookupFunctions);
    const binding = bindingExpression.createBinding(target);
    binding.bind(scope);
    expect(target.getAttribute('foo')).toBe('bar');
    expect(target.foo).toBe(undefined);
    source.foo = 'baz';
    setTimeout(() => {
      expect(target.getAttribute('foo')).toBe('baz');
      expect(target.foo).toBe(undefined);
      done();
    });
  });
});
