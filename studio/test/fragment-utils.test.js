import { expect } from '@esm-bundle/chai';
import { generateUniqueFragmentTitle } from '../src/utils/fragment-utils.js';

describe('generateUniqueFragmentTitle', () => {
    it('returns baseTitle unchanged when no conflict', () => {
        expect(generateUniqueFragmentTitle('card-a', ['card-b'])).to.equal('card-a');
    });
    it('appends -1 for first conflict', () => {
        expect(generateUniqueFragmentTitle('lucy-card', ['lucy-card'])).to.equal('lucy-card-1');
    });
    it('increments suffix past existing clones', () => {
        expect(generateUniqueFragmentTitle('lucy-card', ['lucy-card', 'lucy-card-1'])).to.equal('lucy-card-2');
    });
    it('strips existing -N suffix before incrementing', () => {
        expect(generateUniqueFragmentTitle('lucy-card-1', ['lucy-card-1'])).to.equal('lucy-card-2');
    });
    it('handles empty existingTitles', () => {
        expect(generateUniqueFragmentTitle('card', [])).to.equal('card');
    });
    it('skips gaps (e.g. -1 taken, -2 free)', () => {
        expect(generateUniqueFragmentTitle('card', ['card', 'card-1', 'card-2'])).to.equal('card-3');
    });
});
