import axios, { AxiosInstance } from 'axios';

class RequestHelper {
  axiosInstance: AxiosInstance;
  timeout: number;

  constructor() {
    this.timeout = 1000 * 10;
    this.axiosInstance = axios.create({ baseURL: 'http://localhost:3000', timeout: this.timeout });

    this.axiosInstance.interceptors.request.use((configuration) => {
      const { innerWidth, innerHeight } = window;

      configuration.data = { ...configuration.data, windowInnerWidth: innerWidth, windowInnerHeight: innerHeight };

      return configuration;
    });
  }

  async createScore(data: { score: number; character?: string; playerName: string; startTime: string | null; endTime: string | null }) {
    try {
      const response = await this.axiosInstance({
        method: 'post',
        url: '/score',
        data,
      });

      return { response };
    } catch (error) {
      return { error };
    }
  }

  async getScores() {
    try {
      const response = await this.axiosInstance({
        method: 'get',
        url: '/score',
      });

      return { response };
    } catch (error) {
      return { error };
    }
  }
}

export default RequestHelper;
