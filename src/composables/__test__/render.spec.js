import { useGetChannelIcon, useGetChainImg } from '@/composables';
import channels from '@/config/channels';

describe('Test useGetChannelIcon', () => {
  it('Should return the correct channel icon', () => {
    const channelName = 'telegram';
    const expectedIcon = 'logos:telegram';

    // Mock the channels array
    vi.spyOn(channels, 'find').mockReturnValueOnce({ value: channelName, icon: expectedIcon });

    // Call function
    const icon = useGetChannelIcon(channelName);

    // Assert the result
    expect(icon).toBe(expectedIcon);
  });

  it('Should return undefined if channel is not found', () => {
    const channelName = 'unknownChannel';

    // Mock the channels array
    vi.spyOn(channels, 'find').mockReturnValueOnce(undefined);

    // Call the function
    const icon = useGetChannelIcon(channelName);

    // Assert the result
    expect(icon).toBeUndefined();
  });
});

describe('Test useGetChainImg', () => {
  it('should return the image URL of the specified chain', () => {
    // Sample input data
    const chainName = 'Ethereum';
    const chainsData = [
      { name: 'Bitcoin', imageUrl: 'https://example.com/bitcoin.png' },
      { name: 'Ethereum', imageUrl: 'https://example.com/ethereum.png' },
      { name: 'Ripple', imageUrl: 'https://example.com/ripple.png' },
    ];

    // Call the function
    const result = useGetChainImg(chainName, chainsData);

    // Assert the expected output
    expect(result).toEqual('https://example.com/ethereum.png');
  });

  it('should return an undefined value if the chain is not found', () => {
    // Sample input data
    const chainName = 'Litecoin';
    const chainsData = [
      { name: 'Bitcoin', imageUrl: 'https://example.com/bitcoin.png' },
      { name: 'Ethereum', imageUrl: 'https://example.com/ethereum.png' },
      { name: 'Ripple', imageUrl: 'https://example.com/ripple.png' },
    ];

    // Call the function
    const result = useGetChainImg(chainName, chainsData);

    // Assert the expected output
    expect(result).toBeUndefined();
  });
});
