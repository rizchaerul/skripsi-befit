using System.ComponentModel.DataAnnotations;
using WebService.Enums;

namespace WebService.Models.DataTransferObjects.Vote;

public class SubmitVote
{
    [Required]
    public Guid UserAccountId { get; set; }

    [Required]
    public VoteType VoteType { get; set; }
}
