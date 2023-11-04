
using AutoMapper;
using osutracker.API.Models.AppModels;
using osutracker.Models.OsuModels;

namespace osutracker.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<OsuUser, User>()
                .ForMember(dest => dest.RankedScore, opt => opt.MapFrom(src => src.Statistics.RankedScore))
                .ForMember(dest => dest.TotalScore, opt => opt.MapFrom(src => src.Statistics.TotalScore))
                .ForMember(dest => dest.A, opt => opt.MapFrom(src => src.Statistics.A))
                .ForMember(dest => dest.S, opt => opt.MapFrom(src => src.Statistics.S))
                .ForMember(dest => dest.SH, opt => opt.MapFrom(src => src.Statistics.SH))
                .ForMember(dest => dest.SS, opt => opt.MapFrom(src => src.Statistics.SS))
                .ForMember(dest => dest.SSH, opt => opt.MapFrom(src => src.Statistics.SSH))
                .ForMember(dest => dest.PlayCount, opt => opt.MapFrom(src => src.Statistics.PlayCount));
        }
    }
}